#!/usr/bin/env bash
# Compiles every Java snippet the lessons show, then runs the tests on them.
#
# Needs only a JDK (21 or newer): no Gradle, no Maven, no test library. The
# runner in test/TestRunner.java finds the *Test classes and runs their static
# test* methods. -ea turns assertions on, which the lessons and tests rely on.
#
# Usage, from anywhere:  java/java-collections/run-tests.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
rm -rf out
mkdir out

# -Xlint:all -Werror: a warning in a lesson snippet is a lesson that teaches
# something the compiler itself disapproves of, so it stops the build.
javac -Xlint:all -Werror -d out src/*.java test/*.java
java -ea -cp out TestRunner out
