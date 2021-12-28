
import { createConnection } from 'typeorm';

function connectToDB() {
    createConnection()
        .then(() => {
            console.log('Successfully connected to database');
        })
        .catch((err) => {
            console.log(err);
            // retry with 2s delay
            setTimeout(() => {
                console.log('retrying');
                connectToDB();
            }, 2000);
        });
}

export default connectToDB;