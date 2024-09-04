// Import the framework and instantiate it
import Fastify from 'fastify'
const fastify = Fastify({
    logger: true
})

// Use the import let = require syntax on TS.
import { SplitFactory } from '@splitsoftware/splitio';
// Instantiate the SDK
const factory = SplitFactory({
    core: {
        authorizationKey: 'no7juaokpf9e31h5ivhen3v8lej3aolmo3k9',
    
        key: 'on'
    },
    startup: {
        readyTimeout: 1.5 // 1.5 sec
    }
});
// And get the client instance you'll use
const SplitIOClient = factory.client();

let keyUp = 'on';

// Declare a route
fastify.get('/', async function handler(request, reply) {

    const idClient = crypto.randomUUID();
   

    const treatment =
        SplitIOClient.getTreatment(idClient, 'experimento_1');
    if (treatment == 'on') {
        keyUp = 'on';
    } else if (treatment == 'off') {
        keyUp = 'off';
    } else if (treatment == 'facu') {
        keyUp = 'facu';
    }else {
        // insert your control treatment code here
    }


    return { "experimento_1": keyUp, "idClient": idClient , treatment : treatment }
})

// Run the server!
try {
    await fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}