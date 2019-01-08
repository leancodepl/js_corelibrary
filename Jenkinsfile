def label = "core_js_library-${UUID.randomUUID().toString()}"
podTemplate(label: label, containers: [
    containerTemplate(name: 'jnlp', image: 'jenkins/jnlp-slave'),
    containerTemplate(name: 'node', image: 'node:10-stretch',
                      command: 'cat', ttyEnabled: true)
]) {
    nodeSlack(label) {
        stage('Checkout') {
            checkout scm
            leancode.configureMyGet()
        }

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
}
