pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/내GitHub계정/startbootstrap-resume.git'
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

