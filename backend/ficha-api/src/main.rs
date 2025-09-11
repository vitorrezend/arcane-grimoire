use mongodb::{Client, Collection};
use mongodb::bson::{doc};
use serde::{Deserialize, Serialize};
use tokio::main;

// Define a estrutura de dados para a sua ficha.
// O #[derive(...] adiciona funcionalidades para converter a struct em JSON.
#[derive(Debug, Serialize, Deserialize)]
struct Ficha {
    nome_personagem: String,
    classe: String,
    nivel: u32,
}

#[main]
async fn main() {
    // 1. Conectar ao MongoDB
    // O nome 'mongodb' é o mesmo que definimos no docker-compose.yml.
    let uri = "mongodb://mongodb:27017";
    let client = Client::with_uri_str(uri).await.expect("Erro ao conectar ao MongoDB");

    // 2. Acessar o banco de dados e a coleção
    let db = client.database("rpg_database");
    let collection = db.collection::<Ficha>("fichas");

    // 3. Criar uma nova ficha para salvar
    let nova_ficha = Ficha {
        nome_personagem: "Aragorn".to_string(),
        classe: "Guerreiro".to_string(),
        nivel: 10,
    };

    // 4. Inserir a ficha no banco de dados
    match salvar_ficha(&collection, &nova_ficha).await {
        Ok(_) => println!("Ficha de {} salva com sucesso!", nova_ficha.nome_personagem),
        Err(e) => eprintln!("Erro ao salvar ficha: {:?}", e),
    }
}

// Uma função assíncrona para salvar a ficha na coleção.
async fn salvar_ficha(collection: &Collection<Ficha>, ficha: &Ficha) -> mongodb::error::Result<()> {
    // Insere o documento na coleção.
    //let serialized_doc = mongodb::bson::to_document(&ficha)?;
    //collection.insert_one(serialized_doc, None).await?;
    collection.insert_one(ficha, None).await?;
    Ok(())
}