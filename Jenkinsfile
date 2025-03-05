pipeline {
    agent any
    environment {
        DEPLOY_PATH = "/var/www/html/dist"
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Git 체크아웃
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/master']],  // 수정 필요 시 교체
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[
                            credentialsId: 'github-credentials',
                            url: 'https://github.com/JeonByungSun/startbootstrap-resume.git'
                        ]]
                    ])
                }
            }
        }

        stage('Check Changes') {
            steps {
                script {
                    // 최근 커밋과 바로 이전 커밋 차이 비교
                    def changes = sh(
                        script: "git diff-tree --no-commit-id --name-only -r HEAD HEAD~1",
                        returnStdout: true
                    ).trim()

                    echo "Changed files:\n${changes}"

                    if (changes == '') {
                        echo "No changes detected. Skipping build & deploy."
                        env.NO_CHANGES = 'true'
                    } else {
                        env.NO_CHANGES = 'false'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            when {
                expression {
                    return env.NO_CHANGES == 'false'
                }
            }
            steps {
                script {
                    sh 'echo "Installing dependencies..."'
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            when {
                expression {
                    return env.NO_CHANGES == 'false'
                }
            }
            steps {
                script {
                    sh 'echo "Building project..."'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            when {
                expression {
                    return env.NO_CHANGES == 'false'
                }
            }
            steps {
                script {
                    sh '''
                        echo "Deploying only changed files with rsync..."
                        rsync -av dist/ ${DEPLOY_PATH}/
                    '''
                }
            }
        }
    }
}

