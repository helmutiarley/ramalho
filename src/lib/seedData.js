
import { supabase } from './supabase'

const productTemplates = {
  macbook: [
    {
      name: "MacBook Air M1",
      description: "MacBook Air com chip M1, ideal para tarefas diárias e produtividade",
      specs: {
        processador: "Apple M1",
        memoria: "8GB",
        armazenamento: "256GB SSD",
        tela: "13.3 polegadas Retina"
      },
      price: { base: 7999, installments: 18 }
    },
    {
      name: "MacBook Air M2",
      description: "Novo MacBook Air com chip M2, design renovado e mais potência",
      specs: {
        processador: "Apple M2",
        memoria: "8GB",
        armazenamento: "512GB SSD",
        tela: "13.6 polegadas Liquid Retina"
      },
      price: { base: 9999, installments: 18 }
    },
    {
      name: "MacBook Pro 14",
      description: "MacBook Pro 14 polegadas com M2 Pro, para profissionais exigentes",
      specs: {
        processador: "Apple M2 Pro",
        memoria: "16GB",
        armazenamento: "512GB SSD",
        tela: "14 polegadas Liquid Retina XDR"
      },
      price: { base: 14999, installments: 18 }
    },
    {
      name: "MacBook Pro 16",
      description: "MacBook Pro 16 polegadas com M2 Max, máxima performance",
      specs: {
        processador: "Apple M2 Max",
        memoria: "32GB",
        armazenamento: "1TB SSD",
        tela: "16 polegadas Liquid Retina XDR"
      },
      price: { base: 23999, installments: 18 }
    },
    {
      name: "MacBook Air M1 16GB",
      description: "MacBook Air M1 com memória expandida para multitarefas",
      specs: {
        processador: "Apple M1",
        memoria: "16GB",
        armazenamento: "512GB SSD",
        tela: "13.3 polegadas Retina"
      },
      price: { base: 9499, installments: 18 }
    },
    {
      name: "MacBook Pro 13",
      description: "MacBook Pro 13 polegadas com M2, portátil e potente",
      specs: {
        processador: "Apple M2",
        memoria: "8GB",
        armazenamento: "256GB SSD",
        tela: "13.3 polegadas Retina"
      },
      price: { base: 11999, installments: 18 }
    }
  ],
  ipad: [
    {
      name: "iPad Pro 12.9",
      description: "iPad Pro com tela Liquid Retina XDR e chip M2",
      specs: {
        processador: "Apple M2",
        memoria: "8GB",
        armazenamento: "256GB",
        tela: "12.9 polegadas Liquid Retina XDR"
      },
      price: { base: 9999, installments: 18 }
    },
    {
      name: "iPad Air",
      description: "iPad Air com chip M1, versátil e potente",
      specs: {
        processador: "Apple M1",
        memoria: "8GB",
        armazenamento: "64GB",
        tela: "10.9 polegadas Liquid Retina"
      },
      price: { base: 6799, installments: 18 }
    },
    {
      name: "iPad Mini",
      description: "iPad Mini compacto com chip A15 Bionic",
      specs: {
        processador: "A15 Bionic",
        memoria: "4GB",
        armazenamento: "64GB",
        tela: "8.3 polegadas Liquid Retina"
      },
      price: { base: 5499, installments: 18 }
    },
    {
      name: "iPad 10ª Geração",
      description: "iPad com design renovado e chip A14 Bionic",
      specs: {
        processador: "A14 Bionic",
        memoria: "4GB",
        armazenamento: "64GB",
        tela: "10.9 polegadas Retina"
      },
      price: { base: 4999, installments: 18 }
    },
    {
      name: "iPad Pro 11",
      description: "iPad Pro 11 polegadas com chip M2",
      specs: {
        processador: "Apple M2",
        memoria: "8GB",
        armazenamento: "128GB",
        tela: "11 polegadas Liquid Retina"
      },
      price: { base: 8999, installments: 18 }
    },
    {
      name: "iPad 9ª Geração",
      description: "iPad clássico com chip A13 Bionic",
      specs: {
        processador: "A13 Bionic",
        memoria: "3GB",
        armazenamento: "64GB",
        tela: "10.2 polegadas Retina"
      },
      price: { base: 3799, installments: 18 }
    }
  ],
  iphone: [
    {
      name: "iPhone 15 Pro Max",
      description: "iPhone 15 Pro Max com chip A17 Pro e câmera profissional",
      specs: {
        processador: "A17 Pro",
        memoria: "8GB",
        armazenamento: "256GB",
        tela: "6.7 polegadas Super Retina XDR"
      },
      price: { base: 9999, installments: 18 }
    },
    {
      name: "iPhone 15 Pro",
      description: "iPhone 15 Pro com Titanium e câmera de 48MP",
      specs: {
        processador: "A17 Pro",
        memoria: "8GB",
        armazenamento: "128GB",
        tela: "6.1 polegadas Super Retina XDR"
      },
      price: { base: 8999, installments: 18 }
    },
    {
      name: "iPhone 15",
      description: "iPhone 15 com Dynamic Island e câmera de 48MP",
      specs: {
        processador: "A16 Bionic",
        memoria: "6GB",
        armazenamento: "128GB",
        tela: "6.1 polegadas Super Retina XDR"
      },
      price: { base: 7299, installments: 18 }
    },
    {
      name: "iPhone 15 Plus",
      description: "iPhone 15 Plus com tela maior e bateria duradoura",
      specs: {
        processador: "A16 Bionic",
        memoria: "6GB",
        armazenamento: "128GB",
        tela: "6.7 polegadas Super Retina XDR"
      },
      price: { base: 8299, installments: 18 }
    },
    {
      name: "iPhone 14",
      description: "iPhone 14 com chip A15 Bionic e câmera avançada",
      specs: {
        processador: "A15 Bionic",
        memoria: "6GB",
        armazenamento: "128GB",
        tela: "6.1 polegadas Super Retina XDR"
      },
      price: { base: 5999, installments: 18 }
    },
    {
      name: "iPhone 13",
      description: "iPhone 13 com ótimo custo-benefício",
      specs: {
        processador: "A15 Bionic",
        memoria: "4GB",
        armazenamento: "128GB",
        tela: "6.1 polegadas Super Retina XDR"
      },
      price: { base: 4999, installments: 18 }
    }
  ],
  watch: [
    {
      name: "Apple Watch Ultra 2",
      description: "Apple Watch Ultra 2 com tela mais brilhante e resistente",
      specs: {
        processador: "S9 SiP",
        memoria: "32GB",
        armazenamento: "32GB",
        tela: "49mm Always-On Retina"
      },
      price: { base: 9899, installments: 18 }
    },
    {
      name: "Apple Watch Series 9",
      description: "Apple Watch Series 9 com chip S9 e Double Tap",
      specs: {
        processador: "S9 SiP",
        memoria: "32GB",
        armazenamento: "32GB",
        tela: "45mm Always-On Retina"
      },
      price: { base: 4999, installments: 18 }
    },
    {
      name: "Apple Watch SE 2",
      description: "Apple Watch SE 2ª geração, essencial e acessível",
      specs: {
        processador: "S8 SiP",
        memoria: "32GB",
        armazenamento: "32GB",
        tela: "44mm Retina"
      },
      price: { base: 3499, installments: 18 }
    },
    {
      name: "Apple Watch Series 9 Aço",
      description: "Apple Watch Series 9 em aço inoxidável",
      specs: {
        processador: "S9 SiP",
        memoria: "32GB",
        armazenamento: "32GB",
        tela: "41mm Always-On Retina"
      },
      price: { base: 7999, installments: 18 }
    },
    {
      name: "Apple Watch Ultra",
      description: "Apple Watch Ultra primeira geração",
      specs: {
        processador: "S8 SiP",
        memoria: "32GB",
        armazenamento: "32GB",
        tela: "49mm Always-On Retina"
      },
      price: { base: 7999, installments: 18 }
    },
    {
      name: "Apple Watch Series 8",
      description: "Apple Watch Series 8 com sensor de temperatura",
      specs: {
        processador: "S8 SiP",
        memoria: "32GB",
        armazenamento: "32GB",
        tela: "45mm Always-On Retina"
      },
      price: { base: 4499, installments: 18 }
    }
  ],
  mac: [
    {
      name: "iMac M1 24",
      description: "iMac 24 polegadas com chip M1 e design colorido",
      specs: {
        processador: "Apple M1",
        memoria: "8GB",
        armazenamento: "256GB SSD",
        tela: "24 polegadas 4.5K Retina"
      },
      price: { base: 12999, installments: 18 }
    },
    {
      name: "Mac Mini M2",
      description: "Mac Mini com chip M2, compacto e potente",
      specs: {
        processador: "Apple M2",
        memoria: "8GB",
        armazenamento: "256GB SSD",
        tela: "Não inclusa"
      },
      price: { base: 6999, installments: 18 }
    },
    {
      name: "Mac Studio M2 Max",
      description: "Mac Studio com M2 Max para profissionais",
      specs: {
        processador: "Apple M2 Max",
        memoria: "32GB",
        armazenamento: "512GB SSD",
        tela: "Não inclusa"
      },
      price: { base: 19999, installments: 18 }
    },
    {
      name: "Mac Pro M2 Ultra",
      description: "Mac Pro com M2 Ultra, máxima performance",
      specs: {
        processador: "Apple M2 Ultra",
        memoria: "64GB",
        armazenamento: "1TB SSD",
        tela: "Não inclusa"
      },
      price: { base: 54999, installments: 18 }
    },
    {
      name: "Mac Mini M2 Pro",
      description: "Mac Mini com M2 Pro para demandas profissionais",
      specs: {
        processador: "Apple M2 Pro",
        memoria: "16GB",
        armazenamento: "512GB SSD",
        tela: "Não inclusa"
      },
      price: { base: 9999, installments: 18 }
    },
    {
      name: "iMac M1 16GB",
      description: "iMac 24 com memória expandida para multitarefas",
      specs: {
        processador: "Apple M1",
        memoria: "16GB",
        armazenamento: "512GB SSD",
        tela: "24 polegadas 4.5K Retina"
      },
      price: { base: 14999, installments: 18 }
    }
  ]
}

export const seedProducts = async () => {
  try {
    // Primeiro, vamos pegar todas as categorias existentes
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')

    if (categoriesError) throw categoriesError

    // Para cada categoria, vamos adicionar os produtos correspondentes
    for (const category of categories) {
      const products = productTemplates[category.slug]
      if (!products) continue

      for (const product of products) {
        try {
          await supabase
            .from('products')
            .insert([{
              ...product,
              category_id: category.id
            }])
        } catch (error) {
          console.error(`Error adding product ${product.name}:`, error)
        }
      }
    }

    return { success: true, message: "Produtos de teste adicionados com sucesso" }
  } catch (error) {
    console.error('Error seeding products:', error)
    return { success: false, message: "Erro ao adicionar produtos de teste" }
  }
}
