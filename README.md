# udn-horo-gcp

[comicat-hu/udn-horoscopes](https://github.com/comicat-hu/udn-horoscopes) 基於Google Cloud Platform運行的版本

## Settings

* example.env.yaml is the settings for gcloud function environment variables in runtime.

## Deploy commands

* create pub/sub topic

    `gcloud pubsub topics create daily-horo`

* create/update functions

    `gcloud functions deploy slack-udn-horo --entry-point handler --env-vars-file .env.yaml --trigger-topic daily-horo --runtime nodejs16`

* create scheduler

    `gcloud scheduler jobs create pubsub daily-trigger-am800 --schedule='0 8 * * *' --time-zone='Asia/Taipei' --topic=daily-horo --message-body 'wakeup'`
