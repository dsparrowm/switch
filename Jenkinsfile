node {
    stage('Checkout') {
        checkout scm
    }

    stage('Install Dependencies') {
        sh 'npm ci'
    }

    stage('Test') {
        sh 'npm run test:e2e'
    }  
}
