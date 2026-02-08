pipeline {
    agent any

    parameters {
        string(
            name: 'RELEASE_VERSION',
            defaultValue: '0',
            description: 'Please insert sprint number , which is active. this version would be use as tag number. ( Example: Sprint number = 20 ).'
        )
        string(
            name: 'BACKEND_SERVICE',
            defaultValue: 'http://127.0.0.1:11007',
            description: 'Backend service base URL passed to container as env BACKEND_SERVICE.'
        )
        string(
            name: 'DOCUMENT_SERVICE',
            defaultValue: 'http://127.0.0.1:11000',
            description: 'Document service base URL passed to container as env DOCUMENT_SERVICE.'
        )
        string(
            name: 'APP_HOST_PORT',
            defaultValue: '4400',
            description: 'Host port to expose the webapp container (container listens on 8080).'
        )
    }

    options {
        // This is required if you want to clean before build
        skipDefaultCheckout(true)
    }

    tools { nodejs "nodejs" }

    environment {
        BRANCH_NAME   = "${env.BRANCH_NAME}"
        BUILD_NUMBER  = "${env.BUILD_NUMBER}"
        KISH_REGISTRY = "reg.kishports.com/cmms/prod"
        KISH_IMAGE    = "dayan-webapp"
    }

    stages {
        stage('Prepare Build') {
            steps {
                // Clean before build
                cleanWs()
                // We need to explicitly checkout from SCM here
                checkout scm
                echo "Building ${env.JOB_NAME}..."
            }
        }

        stage('Build') {
            steps {
                echo "Build starting ..................."
                sh 'npm --version && node --version'
                sh 'rm -f -r .angular && rm -f -r node_modules && rm -f -r package-lock.json'
                sh 'npm cache clean --force'
                sh 'npm install --legacy-peer-deps'
                sh 'npm run build'
            }
        }

        stage('Build Docker image') {
            tools { nodejs "nodejs" }
            steps {
                sh '''
                  docker load -i /var/jenkins_home/node-20.11.0.tar || true
                  docker load -i /var/jenkins_home/nginx_1.27-alpine.tar || true
                  export DOCKER_BUILDKIT=0
                  docker build -t dayan-webapp:$RELEASE_VERSION --pull=false --no-cache --platform linux/amd64 -f Dockerfile .
                '''
            }
        }

        stage('Deploy To Test Server') {
            tools { nodejs "nodejs" }
            when {
                expression { BRANCH_NAME == 'main' }
            }
            steps {
                sh 'docker stop dayan-webapp || true'
                sh 'docker rm dayan-webapp || true'
                sh """
                  docker run -p ${params.APP_HOST_PORT}:8080 \
                    -e BACKEND_SERVICE="${params.BACKEND_SERVICE}" \
                    -e DOCUMENT_SERVICE="${params.DOCUMENT_SERVICE}" \
                    --name dayan-webapp -d dayan-webapp:$RELEASE_VERSION
                """
            }
        }
    }
}
