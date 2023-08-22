#!/bin/bash

# Read the command line argument (import/export)
action="$1"

# Check if the argument is provided and valid
if [[ -z "$action" || ("$action" != "import" && "$action" != "export") ]]; then
  echo "Error: Please provide an argument (export/import). X"
  exit 1
fi

# Determine the root directory path
ROOT_DIR="$(dirname "$(dirname "$0")")"

# Load environment variables from .env file
if [[ -f "$ROOT_DIR/.env" ]]; then
  source "$ROOT_DIR/.env"
else
  echo "Error: .env file not found! X"
  exit 1
fi

# Check if required environment variables are set
if [[ -z "$DATABASE_URL" || -z "$DATABASE_NAME" ]]; then
  echo "Error: Database credentials must be set in .env! X"
  exit 1
fi

# Prompt user for confirmation
echo -n "Are you sure you want to $action data? (yes/no): "
read -r confirmation

if [[ "$confirmation" != "yes" ]]; then
  echo "Action canceled."
  exit 0
fi

# Get all collections
collections=$(mongo "$DATABASE_URL/$DATABASE_NAME" --quiet --eval 'db.getCollectionNames()')
# Remove square brackets and double quotes from the collection names
collections=${collections//[\"\[\]]/}
IFS=',' read -ra collection_array <<<"$collections"

if [[ "$action" == "export" ]]; then

  for collection in "${collection_array[@]}"; do
    collection=$(echo "$collection" | xargs) # Remove leading/trailing spaces
    if mongoexport --uri="$DATABASE_URL" --db="$DATABASE_NAME" --collection="$collection" --out="$ROOT_DIR/seeds/db/exportDB/$collection.json" --jsonArray --pretty; then
      echo "Exported collection $collection to $collection.json. ✔"
    else
      echo "Error exporting collection $collection! X"
    fi
  done

  echo "All collections exported successfully as JSON. ✔✔✔"

elif [[ "$action" == "import" ]]; then
  # Import MongoDB data
  for collection in "${collection_array[@]}"; do
    collection=$(echo "$collection" | xargs) # Remove leading/trailing spaces
    if [[ "$collection" != "system.indexes" ]]; then
      mongo "$DATABASE_URL/$DATABASE_NAME" --eval "db.$collection.remove({})"
      echo "Emptied collection $collection"
    fi
  done

  json_files=$(ls "$ROOT_DIR/seeds/db/exportDB"/*.json)
  for json_file in $json_files; do
    collection="${json_file##*/}"    # Extract collection name from filename
    collection="${collection%.json}" # Remove .json extension
    if mongoimport --uri="$DATABASE_URL" --db="$DATABASE_NAME" --collection="$collection" --file="$json_file" --jsonArray; then
      echo "Imported collection $collection from $json_file ✔"
    else
      echo "Error importing collection $collection from $json_file! X"
    fi
  done

  echo "All JSON files imported successfully into the database. ✔✔✔"
fi
