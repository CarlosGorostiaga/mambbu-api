import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Crear agencia
  const agency = await prisma.agency.create({
    data: {
      name: 'Mambbu Real Estate',
      verified: true
    }
  });

  console.log('✅ Agencia creada:', agency.name);

  // Crear agente
  const agent = await prisma.agent.create({
    data: {
      name: 'Elena Gómez',
      avatar: 'https://drive.google.com/uc?export=view&id=1yFdcxif8K3kFfDuLL-EpsockPAO7xuco',
      rating: 5,
      reviews: 48,
      responseTime: 'Menos de 1 hora',
      activeListings: 24,
      salesClosed: 127,
      whatsapp: '+53 5555 1234',
      agencyId: agency.id
    }
  });

  console.log('✅ Agente creado:', agent.name);

  // Crear propiedades
  const properties = [
    {
      slug: 'villa-mar-azul-miramar',
      title: 'Villa Mar Azul',
      description: 'Villa Mar Azul no es solo una residencia, es un pedazo de la historia de La Habana. Construida originalmente en 1958, esta propiedad neocolonial ha sido meticulosamente restaurada para preservar sus detalles arquitectónicos originales mientras incorpora todas las comodidades modernas.\n\nLa propiedad se distribuye en dos niveles, con un imponente vestíbulo de entrada que conduce a una luminosa sala principal. Amplias puertas francesas se abren hacia un patio interior privado y exuberante, el oasis perfecto para el café de la mañana o cócteles bajo las estrellas.',
      price: '$425,000',
      priceValue: 425000,
      location: 'Miramar',
      locationDistrict: 'Playa',
      type: 'villa-playa',
      status: 'available',
      bedrooms: 4,
      bathrooms: 3,
      area: '280m²',
      yearBuilt: 1958,
      featured: true,
      newListing: true,
      verified: false,
      quickResponse: false,
      images: JSON.stringify([
        { url: 'https://drive.google.com/uc?export=view&id=1n6F01gnYtM2YUuG_ioYCadkdxAdYarZk', alt: 'Fachada Villa Mar Azul' },
        { url: 'https://drive.google.com/uc?export=view&id=1H_c47CdtoMEiuaywBpsVTYmkb8RCmqG4', alt: 'Sala de estar elegante' },
        { url: 'https://drive.google.com/uc?export=view&id=1vGKp1RbaNBxwMy3ui4DS0GD2hyKwU8z6', alt: 'Jardín tropical' },
        { url: 'https://drive.google.com/uc?export=view&id=1I1mvDesqWEZ6HN8edqrcenUbnx13spNK', alt: 'Cocina moderna' }
      ]),
      amenities: JSON.stringify([
        'Pisos de mosaico originales',
        'Terraza en azotea',
        'Jardín privado',
        'Seguridad 24/7',
        'Internet de alta velocidad',
        'Vista al océano',
        'Garaje para 2 vehículos',
        'Aire acondicionado central'
      ]),
      agentId: agent.id
    },
    {
      slug: 'penthouse-someillan-vedado',
      title: 'Penthouse Someillán',
      description: 'Espectacular penthouse en el corazón del Vedado con vistas panorámicas al Malecón. Ubicado en uno de los edificios más emblemáticos del barrio, este apartamento ofrece luminosidad excepcional y acabados de primera calidad.',
      price: '$185,000',
      priceValue: 185000,
      location: 'Vedado',
      locationDistrict: 'Plaza',
      type: 'penthouse',
      status: 'available',
      bedrooms: 2,
      bathrooms: 2,
      area: '125m²',
      yearBuilt: 1955,
      featured: false,
      newListing: true,
      verified: false,
      quickResponse: true,
      images: JSON.stringify([
        { url: 'https://drive.google.com/uc?export=view&id=16Ctdi_pK_gH6F4XEusVRfk9XdTyNfXBu', alt: 'Vista al Malecón' },
        { url: 'https://drive.google.com/uc?export=view&id=1YeEZOKv_-7mT7x890mbovyV1JKCaolTB', alt: 'Sala con balcón' }
      ]),
      amenities: JSON.stringify([
        'Vistas panorámicas al Malecón',
        'Balcón amplio',
        'Recién renovado',
        'Pisos de mármol',
        'Cocina equipada'
      ]),
      agentId: agent.id
    },
    {
      slug: 'palacete-tropical-siboney',
      title: 'Palacete Tropical',
      description: 'Impresionante palacete en Siboney con amplios jardines y piscina. Esta joya arquitectónica combina el encanto colonial con amenidades modernas en una de las zonas más exclusivas de La Habana.',
      price: '$890,000',
      priceValue: 890000,
      location: 'Siboney',
      locationDistrict: 'Playa',
      type: 'palacete',
      status: 'available',
      bedrooms: 6,
      bathrooms: 5,
      area: '650m²',
      yearBuilt: 1948,
      featured: false,
      newListing: false,
      verified: true,
      quickResponse: false,
      images: JSON.stringify([
        { url: 'https://drive.google.com/uc?export=view&id=1n6F01gnYtM2YUuG_ioYCadkdxAdYarZk', alt: 'Fachada principal' },
        { url: 'https://drive.google.com/uc?export=view&id=1vGKp1RbaNBxwMy3ui4DS0GD2hyKwU8z6', alt: 'Jardín con piscina' }
      ]),
      amenities: JSON.stringify([
        'Piscina privada',
        'Jardín tropical extenso',
        'Garaje para 4 autos',
        'Casa de huéspedes',
        'Barbacoa exterior',
        'Sistema de seguridad completo'
      ]),
      agentId: agent.id
    },
    {
      slug: 'casa-familiar-cerro',
      title: 'Casa Familiar',
      description: 'Acogedora casa familiar en el Cerro, perfecta para familias que buscan un hogar espacioso a precio accesible. Excelente ubicación cerca de escuelas y comercios.',
      price: '$35,000',
      priceValue: 35000,
      location: 'Cerro',
      locationDistrict: 'Cerro',
      type: 'casa-independiente',
      status: 'available',
      bedrooms: 3,
      bathrooms: 1,
      area: '95m²',
      yearBuilt: 1960,
      featured: false,
      newListing: false,
      verified: false,
      quickResponse: false,
      images: JSON.stringify([
        { url: 'https://drive.google.com/uc?export=view&id=1I1mvDesqWEZ6HN8edqrcenUbnx13spNK', alt: 'Fachada' }
      ]),
      amenities: JSON.stringify([
        'Patio trasero',
        'Cerca de transporte público',
        'Zona residencial tranquila'
      ]),
      agentId: agent.id
    },
    {
      slug: 'estudio-san-rafael',
      title: 'Estudio San Rafael',
      description: 'Compacto estudio en Centro Habana, ideal para inversión o primera vivienda.',
      price: '$75,000',
      priceValue: 75000,
      location: 'Centro Habana',
      locationDistrict: 'Centro Habana',
      type: 'apartamento-colonial',
      status: 'sold',
      bedrooms: 1,
      bathrooms: 1,
      area: '45m²',
      featured: false,
      newListing: false,
      verified: false,
      quickResponse: false,
      images: JSON.stringify([
        { url: 'https://drive.google.com/uc?export=view&id=16Ctdi_pK_gH6F4XEusVRfk9XdTyNfXBu', alt: 'Interior' }
      ]),
      amenities: JSON.stringify([
        'Céntrico',
        'Balcón pequeño'
      ]),
      agentId: agent.id
    },
    {
      slug: 'apartamento-moderno-nuevo-vedado',
      title: 'Apartamento Moderno',
      description: 'Apartamento renovado en Nuevo Vedado con respuesta rápida del vendedor.',
      price: '$120,000',
      priceValue: 120000,
      location: 'Nuevo Vedado',
      locationDistrict: 'Plaza',
      type: 'apartamento-colonial',
      status: 'available',
      bedrooms: 2,
      bathrooms: 1,
      area: '68m²',
      featured: false,
      newListing: false,
      verified: false,
      quickResponse: true,
      images: JSON.stringify([
        { url: 'https://drive.google.com/uc?export=view&id=1YeEZOKv_-7mT7x890mbovyV1JKCaolTB', alt: 'Sala moderna' }
      ]),
      amenities: JSON.stringify([
        'Recién pintado',
        'Ventanas nuevas',
        'Cerca de parques'
      ]),
      agentId: agent.id
    }
  ];

  for (const property of properties) {
    await prisma.property.create({ data: property });
    console.log(`✅ Propiedad creada: ${property.title}`);
  }

  console.log('🎉 Seed completado! Total: ' + properties.length + ' propiedades');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });