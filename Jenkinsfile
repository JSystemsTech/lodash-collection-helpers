pipeline {
    agent { docker 'node:6.3' }
    stages {
    	agent {
        	docker { image 'node:7-alpine' }
    	}
        stage('build') {
            steps {
                sh 'npm test'
            }
        }
    }
}