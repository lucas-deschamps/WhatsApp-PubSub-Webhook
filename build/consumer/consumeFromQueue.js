import amqp from 'amqplib';
import { DateTime } from 'luxon';
import { amqpServer } from '../config/connections';
import sendHSM from './sendQualifiedHSM';
export async function consumeFromQueue() {
    try {
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();
        await channel.assertQueue('AV');
        channel.consume('AV', async (message) => {
            try {
                const lead = message && JSON.parse(message.content.toString('utf8'));
                const { idlead, email, telefone, data_cad, nome: hsmName, fireHSM: timeToFireHSM, } = lead;
                let hsmPhoneNumber = telefone;
                if ((telefone === null || telefone === void 0 ? void 0 : telefone.substring(0, 2)) !== '55')
                    hsmPhoneNumber = '55'.concat(telefone);
                console.log('idlead:', idlead, '\n');
                console.log(hsmName, email, hsmPhoneNumber, '\ndata_cad:', data_cad, '\nfireHSM at:', timeToFireHSM);
                console.log('\nLead info finished.\n');
                // periodical check on whether it's been 5 days since the new lead was registered
                const currentNow = DateTime.now().setZone('America/Sao_Paulo');
                const currentDate = currentNow.toISO();
                const currentDay = currentNow.weekday;
                const currentMinute = currentNow.minute;
                const currentHour = currentNow.hour;
                const currentTime = parseFloat(`${currentHour}.${(currentMinute < 10) ? '0' + currentMinute : currentMinute}`);
                console.log('Date:', currentDate, '\nWeekday:', currentDay, '\nTime:', currentTime, '\n');
                /* DOM – 08h às 18h00 */
                if (currentDay === 7 && currentDate >= timeToFireHSM && (currentTime >= 8.00 && currentTime < 18.00) && message) {
                    console.log('HSM being fired:\n');
                    console.log(currentDate, ' >= (time to fire HSM)', timeToFireHSM);
                    sendHSM(hsmName, hsmPhoneNumber, channel, message);
                }
                /* SEG a SAB – 08h às 20h40 */
                if (currentDate >= timeToFireHSM && currentDay !== 7 && (currentTime >= 8.00 && currentTime < 20.40) && message) {
                    console.log('HSM being fired:\n');
                    console.log(currentDate, ' >= (time to fire HSM)', timeToFireHSM);
                    sendHSM(hsmName, hsmPhoneNumber, channel, message);
                }
            }
            catch (err) {
                console.error(err);
            }
        }); // end of channel.consume
        console.log("\nWaiting for messages...\n");
    }
    catch (err) {
        console.error(err);
    }
}
; // end of main function consumeFromQueue
