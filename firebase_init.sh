#!/bin/sh
firebase login
firebase init


# setup firestore
firebase apps:create

firebase apps:sdkconfig WEB 1:250228089233:web:c99efe2d0928c55210fa30 > src/base.js
