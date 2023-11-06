@Library('jenkins-common')_

// "all-biulds" for goiteens
node("go-web"){
    stage('Load credentials') {
        withCredentials([
            string(credentialsId: 'telegramApiTokenJenkinsSoftryzen', variable: 'telegramNotifyChannelBotApiToken'),
            string(credentialsId: 'telegramChatIdJenkinsSoftryzen', variable: 'telegramNotifyChannelChatId'),

            //ADD FTP CREDENTIAL
            string(credentialsId: 'ftp_user_pass_host_for_example', variable: 'ftpUserAndPass')
        ]) {
                env.gitRepository = 'git@github.com:GoWeb-Studio/example-repo.git';
                env.gitBranch = 'main';
                env.folderPath = './ua/';
                //
                env.telegramNotifyChannelBotApiToken = telegramNotifyChannelBotApiToken;
                env.telegramNotifyChannelChatId = telegramNotifyChannelChatId;
                env.ftpUserAndPass = ftpUserAndPass;
        }
    }

    stage('Setup texts') {
        def buildUrl = env.RUN_DISPLAY_URL;

        env.startBuildText = java.net.URLEncoder.encode("➡️ *${JOB_NAME}* started.\n[Go to build](${buildUrl})", "UTF-8");
        env.successBuildText = java.net.URLEncoder.encode("✅ *${JOB_NAME}* SUCCESS.\nTime: TIME\n[Go to build](${buildUrl})", "UTF-8");
        env.failedBuildText = java.net.URLEncoder.encode("❌ *${JOB_NAME}* FAILED.\nTime: TIME\n[Go to build](${buildUrl})", "UTF-8");
    }

    stage('Pre Build Notify') {
        //Send message to channel
        sendTelegramChannelMessage(
            env.telegramNotifyChannelBotApiToken,
            env.telegramNotifyChannelChatId,
            env.startBuildText
        );
    }

    stage('Clone Git Repo') {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
            git branch: env.gitBranch, credentialsId: 'pasha-goitacad-ssh', url: env.gitRepository
        }
    }

   stage('Build'){
       def success = 'SUCCESS'.equals(currentBuild.currentResult);

       if (success) {
           catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
               sh "./build.sh"
           }
       }
   }

    stage('Deploy') {
         def success = 'SUCCESS'.equals(currentBuild.currentResult);

        if (success) {
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                //sent files to url
                sh "ncftpput ${env.ftpUserAndPass} ${env.folderPath} ./build/*"
                sh "rm -r *"
            }
        }
    }

    stage('Post Build Notify') {
        def success = 'SUCCESS'.equals(currentBuild.currentResult);
        def previousBuildSuccess = true;

        if (currentBuild.previousBuild != null && !'SUCCESS'.equals(currentBuild.previousBuild.currentResult)) {
            previousBuildSuccess = false;
        }

        def message = '';

        if (success) {
            message = env.successBuildText;
        } else {
            message = env.failedBuildText;
        }

        //Calculate time
        def durationSeconds = (int) (currentBuild.duration / 1000);
        def durationMinutes = (int) (durationSeconds / 60);
        durationSeconds -= durationMinutes * 60;

        message = message.replace('TIME', "${durationMinutes} min ${durationSeconds} sec");

        //Send message to global notify channel
        sendTelegramChannelMessage(
            env.telegramNotifyChannelBotApiToken,
            env.telegramNotifyChannelChatId,
            message
        )
    }
}