# Trigger Concourse Job action

This action will trigger a specific job in a [Concourse](https://concourse-ci.org) pipeline.

## Inputs

All inputs are required.

* **concourse-url:** The base concourse URL
* **concourse-team:** The concourse team where the pipeline lives. If not set, defaults to `main`
* **concourse-pipeline:** The concourse pipeline where the job lives
* **concourse-job:** The job in the pipeline to trigger
* **concourse-username:** A local auth user with the rights to trigger the job
* **concourse-password:** The password for concourse-user

## Outputs

None

## Example usage

```yaml
uses: actions/trigger-concourse-job-action@v1
with:
  concourse-url: https://concourse.example.com
  concourse-team: test
  concourse-pipeline: deploy-app
  concourse-job: build-and-deploy
  concourse-username: ${secrets.CONCOURSE_USERNAME}
  concourse-password: ${secrets.CONCOURSE_PASSWORD}
```
