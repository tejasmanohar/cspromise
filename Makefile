# Globals
NBIN := node_modules/.bin
SRC := $(shell find src -type f -name "*.js")
TESTS := $(shell find test -type f -name "*.test.js")
ALL := $(LIBS) $(TESTS)

# Executables
BABEL := $(NBIN)/babel
ESLINT := $(NBIN)/eslint
DEPCHECK := $(NBIN)/npm-check
NYC := $(NBIN)/nyc
AVA := $(NBIN)/ava -v
COVERALLS := $(NBIN)/coveralls

# Get dependencies.
install:
	@npm install

# Build w/ babel.
build:
	@$(BABEL) src -d lib

# Run unit tests.
test-unit:
	@$(AVA)

# Check coverage.
coverage: install
	@$(NYC) $(AVA)

# Review code.
lint: install
	@$(ESLINT) $(ALL)

# Fix as many linter errors as possible.
fmt: install
	@$(ESLINT) --fix $(ALL)

# Test code.
test: lint test-unit

# Test -> coverage -> check.
test-ci: test coverage
	@$(NYC) report -r=text-lcov | $(COVERALLS)

# Bye, temp files.
clean:
	@rm -rf coverage .nyc_output node_modules

# Don't get confused.
.PHONY: test coverage
