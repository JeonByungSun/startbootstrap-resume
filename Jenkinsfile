peline {
    agent any
    environment {
        DEPLOY_PATH = "/var/www/html/dist"
        NODE_MODULES_PATH = "/var/lib/jenkins/workspace/StartBootstrap_CI/node_modules"
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
                    sh '''
                    if [ -d "$NODE_MODULES_PATH" ]; then
                        echo "Using cached node_modules"
                        cp -r $NODE_MODULES_PATH node_modules
                    fi
                    npm install
                    cp -r node_modules $NODE_MODULES_PATH
                    '''
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
                    sh '''
                    sudo rsync -av --delete dist/ $DEPLOY_PATH/
                    sudo chown -R www-data:www-data $DEPLOY_PATH
                    '''
                }
            }
        }
    }
}

