pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      steps {
        git(url: 'https://github.com/dsparrowm/switch', branch: 'master')
      }
    }

    stage('Unit Test') {
      steps {
        sh 'npm install && npm run test:unit'
      }
    }

  }
}