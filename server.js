import Fastify from 'fastify';
import { SplitFactory } from '@splitsoftware/splitio';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Cargar variables de entorno desde config.env
dotenv.config({ path: './config.env' });

const fastify = Fastify({
    logger: true
});

const factory = SplitFactory({
    core: {
        authorizationKey: process.env.SPLIT_AUTH_KEY,
        key: 'on'
    },
    startup: {
        readyTimeout: 1.5 // 1.5 sec
    }
});

const SplitIOClient = factory.client();

let keyUp = 'on';

fastify.get('/', async function handler(request, reply) {
    try {
        const idClient = crypto.randomUUID();

        // Espera a que el cliente de Split.io esté listo
        await SplitIOClient.ready();

        const treatment = SplitIOClient.getTreatment(idClient, 'experimento_1');

        switch (treatment) {
            case 'on':
                keyUp = 'on';
                break;
            case 'off':
                keyUp = 'off';
                break;
            case 'facu':
                keyUp = 'facu';
                break;
            default:
                keyUp = 'control';
                break;
        }

        return { "experimento_1": keyUp, "idClient": idClient, treatment: treatment };
    } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info(`Server listening on port 3000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
