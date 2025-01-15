## Changes versus the default kotlin-spring codegen:

apiDelegate.mustache:

- include token as input on authenticated routes
- change flow parameters => flux parameters

apiInterface.mustache:

- include token as input on authenticated routes
- pass token along to delegate

bodyParams.mustache:

- change flow to flux

dataClass.mustache:

- make discriminator interfaces `sealed`
- replace discriminator interface body with custom body
    - generate subclasses for each possible type

dataClassOptVar.mustache:

- don't use default values on nullable/non-required attributes

custom/generatedSecurity.mustache:

- configures Spring's Authorization Manager to authenticate and authorize the authenticated routes
