#!/bin/sh
npm install
prisma generate
prisma db push