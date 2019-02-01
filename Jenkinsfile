leancode.builder('core_js_library')
    .withCustomJnlp()
    .withNode(version: '10-stretch')
    .run {
    stage('Checkout') {
        checkout scm
    }

    leancode.configureRepositories()

    container('node') {
        stage('Restore') {
            sh 'npm install'
        }

        stage('Publish') {
            withCredentials([string(credentialsId: 'LeanCodeNpmToken',
                                    variable: 'NPM_TOKEN')]) {
                sh 'npm run bootstrap'
                sh 'npm run publish:ci'
            }
        }
    }
}
