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

            stage('Build') {
                sh 'npm run bootstrap'
            }

            stage('Publish') {
                sh 'npm run publish:ci'
            }
        }
    }
}
