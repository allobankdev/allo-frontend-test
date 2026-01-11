linux_setup:
	curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
	bash -c '\
		export NVM_DIR="$$HOME/.nvm"; \
		[ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh"; \
		nvm install 18; \
		nvm use 18; \
		nvm alias default 18; \
		node -v; \
		npm install -g yarn \
	'

run_local:
	npm run dev