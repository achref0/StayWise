pipeline {
    agent any
    stages {
        stage('Build Backend') {
            steps {
                script {
                    docker.build('staywise-backend', './backend')
                }
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    docker.build('staywise-frontend', './frontend')
                }
            }
        }
        stage('Build Database') {
            steps {
                script {
                    docker.build('staywise-database', './')
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    def network = 'staywise-network'
                    sh "docker network create ${network} || true"

                    // Deploy Database
                    sh """
                    docker run -d --rm --network ${network} --name staywise-database \
                    -e MYSQL_ROOT_PASSWORD=1234 \
                    -e MYSQL_DATABASE=staywise \
                    staywise-database
                    """

                    // Deploy Backend
                    sh """
                    docker run -d --rm --network ${network} --name staywise-backend \
                    -e DB_HOST=staywise-database \
                    -e DB_NAME=staywise \
                    -e DB_USER=root \
                    -e DB_PASSWORD=1234 \
                    staywise-backend
                    """

                    // Deploy Frontend
                    sh """
                    docker run -d --rm --network ${network} --name staywise-frontend \
                    -e REACT_APP_API_BASE_URL=http://staywise-backend:5000/api \
                    -p 3000:3000 \
                    staywise-frontend
                    """
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}