import amqp from 'amqplib';
import { config } from 'dotenv';

config();

import { DateTime } from 'luxon';
import fetch, { Response as FetchResponse, RequestInit } from 'node-fetch';

import { hsmEndpoint } from '../config/endpoints';
import { amqpServer } from '../config/connections';

import { ILead } from '../interfaces/lead';
import { IQualifiedHSM } from '../interfaces/hsm';

export async function consumeFromQueue(): Promise<void> {
  try {
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    
    await channel.assertQueue('AV');
    
    channel.consume('AV', async (message) => {
      try {
	      const lead: ILead = message && JSON.parse(message.content.toString('utf8'));

        const {
          idlead,
          nome: hsmName,
          email,
          telefone,
          data_cad 
        } = lead;

        let hsmPhoneNumber = telefone;

        if (telefone?.substring(0, 2) !== '55')
          hsmPhoneNumber = '55'.concat(telefone!);

        console.log('idlead:', idlead, '\n');
        console.log(hsmName, email, hsmPhoneNumber, '\ndata_cad:', data_cad);

        // is actually a date and splittable? => then create a DateTime object based on it
        const leadRegisterDate = !!data_cad?.split(' ') && DateTime.fromISO(data_cad!.split(' ')[0]);
        
        // lead's register date +5 days
        const leadDatePlusFive = leadRegisterDate && leadRegisterDate.plus({ days: 5 }).toISO();
        
        console.log('\nCurrent lead\'s register date:', leadRegisterDate && leadRegisterDate.toISO());
        console.log('Plus 5 days:', leadDatePlusFive, '\n');

        console.log('Lead info finished.\n');

        // periodical check on whether it's been 5 days since the new lead was registered
        const currentNow = DateTime.now().setZone('America/Sao_Paulo');

        const currentDate = currentNow.toISO();
        const currentDay = currentNow.weekday;
        const currentMinute = currentNow.minute;
        const currentHour = currentNow.hour;
        
        const currentTime: number = parseFloat(`${currentHour}.${(currentMinute < 10) ? '0' + currentMinute : currentMinute}`);

        console.log(
          'Date:', currentDate,
          '\nWeekday:', currentDay,
          '\nTime:', currentTime, '\n'
        );

        /* DOM – 08h às 18h00 */
        if (currentDay === 7 && currentDate >= leadDatePlusFive && (currentTime >= 8.00 && currentTime < 18.00) && message) {
          console.log('Time to fire HSM:\n');
          console.log(currentDate, ' >= (lead register date +5)', leadDatePlusFive);

          const qualifiedHsmBody: IQualifiedHSM = {
            "cod_conta": 6,
            "hsm": 13,
            "cod_flow": 62,
            "tipo_envio": 1,
            "variaveis": {
              "1": `${hsmName}` || 'nome',
            },
            "contato": {
              "nome": `${hsmName}` || 'nome',
              "telefone": `${hsmPhoneNumber}` || '5548999476359',
            },
            "start_flow": 1
          };

          console.log('\nHSM API post body:', qualifiedHsmBody, '\n');

          const fetchOptions: RequestInit = {
            method: 'POST',
            body: JSON.stringify(qualifiedHsmBody),
            headers: {
              'Authorization': process.env.AUTH_TOKEN as string,
              'Content-Type': 'application/json',
            },
          };

          try {
            const post: FetchResponse = await fetch(hsmEndpoint, fetchOptions);
            const response: any = await post.json();
          
            console.log('\nRES:', response);

            channel.ack(message!);

            message = null;  
          } catch (err) {
            console.error(err);
          }
        }; // end of sunday if

        /* SEG a SAB – 08h às 20h40 */
        if (currentDate >= leadDatePlusFive && currentDay !== 7 && (currentTime >= 8.00 && currentTime < 20.40) && message) {
          console.log('Time to fire HSM:\n');
          console.log(currentDate, ' >= (lead register date +5)', leadDatePlusFive);

          const qualifiedHsmBody: IQualifiedHSM = {
            "cod_conta": 6,
            "hsm": 13,
            "cod_flow": 62,
            "tipo_envio": 1,
            "variaveis": {
              "1": `${hsmName}` || 'nome',
            },
            "contato": {
              "nome": `${hsmName}` || 'nome',
              "telefone": `${hsmPhoneNumber}` || '5548999476359',
            },
            "start_flow": 1
          };

          console.log('\nHSM API post body:', qualifiedHsmBody, '\n');

          const fetchOptions: RequestInit = {
            method: 'POST',
            body: JSON.stringify(qualifiedHsmBody),
            headers: {
              'Authorization': process.env.AUTH_TOKEN as string,
              'Content-Type': 'application/json',
            },
          };

          try {
            const post: FetchResponse = await fetch(hsmEndpoint, fetchOptions);
            const response: any = await post.json();
          
            console.log('\nRES:', response);

            channel.ack(message!);

            message = null;    
          } catch (err) {
            console.error(err);
          }
        }; // end of weekday + saturday if
      } catch (err) {
        console.error(err);
      } 
    }); // end of channel.consume

    console.log("\nWaiting for messages...\n");
  } catch (err) {
      console.error(err);
  }
}; // end of main function consumeFromQueue
