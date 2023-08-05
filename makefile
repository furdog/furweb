all: build

.PHONY: build
build:
	mkdir -p build
	. ./autogen.sh

.PHONY: arduino
arduino: build
	$(MAKE) -C arduino

FORMAT := clang-format -style=file -i *.js
format:
	$(FORMAT)
