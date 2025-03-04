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
                    // 필요한 의존성 설치
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // 빌드 (dist 폴더 생성)
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // 기존 배포 파일 삭제
                    sh 'rm -rf /var/www/html/dist/*'
                    // 빌드 결과 복사
                    sh 'cp -r dist/* /var/www/html/dist/'
                    // chown 제거 (권한 문제 해결)
                }
            }
        }
    }
}

