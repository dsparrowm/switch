<<<<<<< HEAD
=======
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
>>>>>>> 643642a22ccc994abc8c911cb34765ab36b702f9
