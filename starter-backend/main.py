from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy import text
from pydantic import BaseModel



class Recipe(BaseModel):
    user_name: str
    datetime: str
    bean: str
    dose_grams: float
    yield_grams: float
    time_seconds: int
    temp_setting: int
    grind_setting: int
    days_since_roastdate: int
    rating: float

DATABASE_URL = "postgresql://localhost/coffee_app"

engine = create_engine(DATABASE_URL)

# Create a FastAPI instance
app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/greeting/{name}")
async def read_item(name: str):
    return {"message": f"Hello {name}"}

@app.get("/coffees")
async def get_coffees():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT * FROM coffees")
        )

        return [dict(row._mapping) for row in result]

@app.get("/recipes")
async def get_recipes():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT * FROM recipes")
        )

        return [dict(row._mapping) for row in result]

@app.post("/recipes")
async def add_recipe(data: Recipe):
    query = text("""
        INSERT INTO recipes (
            user_name,
            datetime,
            bean,
            dose_grams,
            yield_grams,
            time_seconds,
            temp_setting,
            grind_setting,
            days_since_roastdate,
            rating
        )
        VALUES (
            :user_name,
            :datetime,
            :bean,
            :dose_grams,
            :yield_grams,
            :time_seconds,
            :temp_setting,
            :grind_setting,
            :days_since_roastdate,
            :rating
        )
    """)
    with engine.begin() as connection:
        connection.execute(
            query,
            {
                "user_name": data.user_name,
                "datetime": data.datetime,
                "bean": data.bean,
                "dose_grams": data.dose_grams,
                "yield_grams": data.yield_grams,
                "time_seconds": data.time_seconds,
                "temp_setting": data.temp_setting,
                "grind_setting": data.grind_setting,
                "days_since_roastdate": data.days_since_roastdate,
                "rating": data.rating
            }
        )
@app.delete("/recipes/{id}")
async def delete_recipe(id):
    query = text("""
        DELETE FROM recipes
        WHERE id = :id
    """)

    with engine.begin() as connection:
        connection.execute(query, {"id": id})
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,                             # CORS middleware class
    allow_origins=["*"],    # Only allow requests from this origin
    allow_credentials=True,                     # Lets browser access response cookies, auth headers, etc.
    allow_methods=["*"],                        # Allow all request methods
    allow_headers=["*"],                        # Allow all request headers
)

