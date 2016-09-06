# Globals
NBIN := node_modules/.bin
SRC := $(shell find src -type f -name "*.js")
TESTS := $(shell find test -type f -name "*.test.js")
EX := $(shell find examples -type f -name "*.js")
ALL := $(SRC) $(TESTS) $(EX)

# Executables
BABEL := $(NBIN)/babel
STANDARD := $(NBIN)/standard
DEPCHECK := $(NBIN)/npm-check
NYC := $(NBIN)/nyc
AVA := $(NBIN)/ava -v
COVERALLS := $(NBIN)/coveralls

# Get dependencies.
install:
	@npm install

# Build w/ babel.
build: install
	@$(BABEL) src -d lib

# Run unit tests.
test-unit:
	@$(AVA)

# Check coverage.
coverage: install
	@$(NYC) $(AVA)

# Review code.
lint: install
	@$(STANDARD) $(ALL)

# Fix as many linter errors as possible.
fmt: install
	@$(STANDARD) --fix $(ALL)

# Test code.
test: lint test-unit

# Test -> coverage -> check.
test-ci: test coverage
	@$(NYC) report -r=text-lcov | $(COVERALLS)

# Push.
ship: build
	# update "version" in package.json
	# git release (tag, push)
	npm publish

# Bye, temp files.
clean:
	@rm -rf coverage .nyc_output node_modules

# Don't get confused.
.PHONY: test coverage lint
