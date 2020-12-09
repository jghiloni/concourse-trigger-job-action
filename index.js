const core = require('@actions/core');

const http = require('http');
const https = require('https');
const fs = require('fs');

const { execSync } = require('child_process');

try {
    const concourseURL = core.getInput("concourse-url");
    const concourseTeam = core.getInput("concourse-team")
    const concourseUsername = core.getInput("concourse-username");
    const concoursePassword = core.getInput("concourse-password");
    const concoursePipeline = core.getInput("concourse-pipeline");
    const concourseJob = core.getInput("concourse-job");

    const triggerTheJob = () => {
        console.log('hi!')
        execSync(`chmod 0755 ./fly`)
        execSync(`./fly -t concourse login -c ${concourseURL} -u ${concourseUsername} -p ${concoursePassword} -n ${concourseTeam} -k`)
        const stdout = execSync(`./fly -t concourse trigger-job --job ${concoursePipeline}/${concourseJob}`)
        const idx = stdout.indexOf("#")
        if (idx == -1) {
            core.setFailed(`unexpected output from command: ${stdout}`)
            return
        }
    
        const buildNum = stdout.toString("utf8", idx + 1);
        core.setOutput("build-url", `${concourseURL}/teams/${concourseTeam}/pipelines/${concoursePipeline}/jobs/${concourseJob}/builds/${buildNum}`)
    }

    const h = https;
    if (concourseURL.startsWith("http://")) {
        h = http;
    }

    const fly = fs.createWriteStream("fly")
    h.get(`${concourseURL}/api/v1/cli?arch=amd64&platform=linux`, (response) => {
        response.pipe(fly);
        fly.on('finish', () => {
            fly.close(triggerTheJob)
        })
    })
} catch (error) {
    core.setFailed(error)
}
