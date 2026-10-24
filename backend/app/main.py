import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.endpoints import router as api_router

# Configure clean logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("resumecraft")

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Production-grade AI Resume Customization Engine powered by Google Gemini",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for local development and production domains
origins = settings.cors_origins_list
logger.info("Initializing ResumeCraft AI Backend with CORS origins: %s", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Ensure no unhandled internal exceptions leak secrets or stack traces."""
    logger.error("Unhandled server exception at %s: %s", request.url.path, str(exc), exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )


# Include API routes
app.include_router(api_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to ResumeCraft AI API",
        "documentation": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
