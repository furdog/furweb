all: build

.PHONY: build
build:
	mkdir -p build
	. ./autogen.sh ../

FORMAT := clang-format -style=file -i *.h
format:
	$(FORMAT)
