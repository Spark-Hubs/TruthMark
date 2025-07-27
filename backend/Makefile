.PHONY: ruff isort start

ruff:
	ruff check app/

isort:
	isort app/

start:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
