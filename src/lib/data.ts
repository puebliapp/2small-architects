export interface Project {
    id: string;
    title: string;
    slug: string;
    type: string;
    location: string;
    imageUrl: string; // Thumb / Main
    images?: string[]; // Gallery for carousel
    description?: string;
    pressLink?: string; // New field
}

export const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Vivienda familiar',
        slug: 'vivienda-familiar',
        type: 'Residential',
        location: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop', // Interior living
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2700&auto=format&fit=crop', // Bathroom/Detail
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2700&auto=format&fit=crop'  // Additional Distinct Interior
        ],
        description: `<p>El encuentro entre la ciudad, el diseño y la inspiración en la arquitectura de Gaudí origina este apartamento en la Diagonal de Barcelona. La entrada de la luz en los techos inclinados baña el salón de sobras geométricas. El baño de techo en cúpula y paredes en mosaico está iluminado con la forma de las constelaciones.</p>
      <p>The encounter between the city, design and inspiration in Gaudi's architecture originates this apartment on Barcelona's Diagonal. The entry of light from the sloping ceilings bathes the room in geometric shadows.</p>
      <p>La rencontre entre la ville, le design et l'inspiration dans l'architecture de Gaudí donne naissance à cet appartement sur la Diagonal de Barcelone.</p>`,
        pressLink: 'https://architecturaldigest.com',
    },
    {
        id: '2',
        title: 'Casa-Estudio-Taller',
        slug: 'casa-estudio-taller',
        type: 'Residential',
        location: 'Palencia',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=3200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=3200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2700&auto=format&fit=crop'
        ],
        description: 'A rural retreat combining living space, studio, and workshop. Embracing the vast landscape of classic Castille.',
        pressLink: 'https://dezeen.com',
    },
    {
        id: '3',
        title: 'En proceso',
        slug: 'en-proceso',
        type: 'Landscape',
        location: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2301&auto=format&fit=crop', // generic office/blur
        images: [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2301&auto=format&fit=crop'
        ],
        description: 'Work in progress. Landscape intervention in the metropolitan area.',
    },
    {
        id: '4',
        title: 'Casa Agustín',
        slug: 'casa-agustin',
        type: 'Residential',
        location: 'Asturias',
        imageUrl: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2700&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2700&auto=format&fit=crop'
        ],
        description: 'Rehabilitation of a traditional Asturian house, focusing on wood textures and natural light.',
    },
    {
        id: '5',
        title: 'International Salsa Museum',
        slug: 'salsa-museum',
        type: 'Cultural',
        location: 'NYC',
        imageUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2487&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2487&auto=format&fit=crop'
        ],
        description: 'A vibrant cultural center dedicated to the history and future of Salsa music in the Bronx.',
    },
    {
        id: '6',
        title: 'En proceso',
        slug: 'en-proceso-2',
        type: 'Social',
        location: 'NYC',
        imageUrl: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=2606&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=2606&auto=format&fit=crop'
        ],
        description: 'Social housing project in development.',
    },
];

export const getProjectBySlug = (slug: string) => PROJECTS.find(p => p.slug === slug);
