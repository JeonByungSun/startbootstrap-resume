pipeline {
    agent any
    environment {
        DEPLOY_PATH = "/var/www/html/dist"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/JeonByungSun/startbootstrap-resume.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sh 'sudo rm -rf /var/www/html/dist/*'
                    sh 'sudo cp -r dist/* /var/www/html/dist/'
                    sh 'sudo chown -R www-data:www-data /var/www/html/dist'
                }
            }
        }
    }
}

