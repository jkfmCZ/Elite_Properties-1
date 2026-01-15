package getDB

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func PrintDB() []map[string]interface{} {
	db := connectDB()
	properties := getAllProperties(db)
	return properties
}

func FormatDBForBot() string {
	properties := PrintDB()
	return formatPropertiesForBot(properties)
}

func connectDB() *sql.DB {
	godotenv.Load()

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"))

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func getAllProperties(db *sql.DB) []map[string]interface{} {
	defer db.Close()

	rows, err := db.Query("SELECT * FROM properties WHERE status = 'available' AND published = 1")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	columns, _ := rows.Columns()
	var results []map[string]interface{}

	for rows.Next() {
		values := make([]interface{}, len(columns))
		pointers := make([]interface{}, len(columns))
		for i := range values {
			pointers[i] = &values[i]
		}

		rows.Scan(pointers...)

		row := make(map[string]interface{})
		for i, col := range columns {
			var v interface{}
			val := values[i]
			if b, ok := val.([]byte); ok {
				v = string(b)
			} else {
				v = val
			}
			row[col] = v
		}
		results = append(results, row)
	}

	return results
}

func formatPropertiesForBot(properties []map[string]interface{}) string {
	var builder strings.Builder

	builder.WriteString("=== DATABÁZE NEMOVITOSTÍ ===\n\n")

	for _, prop := range properties {

		id := getStringValue(prop, "id")
		title := getStringValue(prop, "title")
		propertyType := translatePropertyType(getStringValue(prop, "property_type"))
		price := getStringValue(prop, "price")
		city := getStringValue(prop, "city")
		address := getStringValue(prop, "address")
		bedrooms := getStringValue(prop, "bedrooms")
		bathrooms := getStringValue(prop, "bathrooms")
		squareFeet := getStringValue(prop, "square_footage")
		description := getStringValue(prop, "description")

		builder.WriteString(fmt.Sprintf("NEMOVITOST #%s:\n", id))
		builder.WriteString(fmt.Sprintf("- Název: %s\n", title))
		builder.WriteString(fmt.Sprintf("- Typ: %s\n", propertyType))
		builder.WriteString(fmt.Sprintf("- Cena: %s\n", formatPrice(price)))
		builder.WriteString(fmt.Sprintf("- Lokalita: %s\n", city))
		builder.WriteString(fmt.Sprintf("- Adresa: %s\n", address))

		if bedrooms != "" && bedrooms != "0" {
			builder.WriteString(fmt.Sprintf("- Pokoje: %s\n", bedrooms))
		}
		if bathrooms != "" && bathrooms != "0" {
			builder.WriteString(fmt.Sprintf("- Koupelny: %s\n", bathrooms))
		}
		if squareFeet != "" && squareFeet != "0" {
			builder.WriteString(fmt.Sprintf("- Plocha: %s m²\n", squareFeet))
		}

		if description != "" {
			builder.WriteString(fmt.Sprintf("- Popis: %s\n", description))
		}

		if features := getStringValue(prop, "features"); features != "" {

			cleanFeatures := strings.ReplaceAll(features, `["`, "")
			cleanFeatures = strings.ReplaceAll(cleanFeatures, `"]`, "")
			cleanFeatures = strings.ReplaceAll(cleanFeatures, `"`, "")
			if cleanFeatures != "" {
				builder.WriteString(fmt.Sprintf("- Vlastnosti: %s\n", cleanFeatures))
			}
		}

		builder.WriteString("\n")
	}

	return builder.String()
}

func getStringValue(m map[string]interface{}, key string) string {
	if val, exists := m[key]; exists && val != nil {
		return fmt.Sprintf("%v", val)
	}
	return ""
}

func translatePropertyType(propType string) string {
	switch strings.ToLower(propType) {
	case "house":
		return "dům"
	case "apartment":
		return "byt"
	case "commercial":
		return "komerční prostor"
	case "plot":
		return "pozemek"
	case "office":
		return "kancelář"
	default:
		return propType
	}
}

func formatPrice(price string) string {
	if price == "" || price == "0" {
		return "Cena na dotaz"
	}
	return fmt.Sprintf("%s Kč", price)
}
