import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting "Coded Database" Loading (Nigerian Medical Ecosystem)...');

  // 1. Create Default Tenant
  const tenantId = '00000000-0000-0000-0000-000000000000'; // Default System Tenant

  // 2. Load Nigerian Medical Categories
  const categories = [
    { name: 'Mandatory Compliance', slug: 'mandatory-compliance', colorHex: '#EF4444' },
    { name: 'Clinical Excellence', slug: 'clinical-excellence', colorHex: '#2362EB' },
    { name: 'Professional Development', slug: 'professional-development', colorHex: '#FBBF24' },
    { name: 'Ethics & Law', slug: 'ethics-law', colorHex: '#34D399' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        colorHex: cat.colorHex,
        tenantId,
      },
    });
    console.log(`✅ Loaded Category: ${cat.name}`);
  }

  // 3. Load Mandatory Nigerian Medical Modules (The Compliance Floor)
  const mandatoryCourses = [
    {
      title: 'Ethics & Jurisprudence in Nigerian Practice',
      description: 'The definitive guide to MDCN ethics and medical law in Nigeria.',
      slug: 'ethics-jurisprudence',
      category: 'ethics-law',
      duration: 60,
    },
    {
      title: 'Data Protection & NDPA for Healthcare',
      description: 'Ensuring compliance with the Nigeria Data Protection Act in clinical settings.',
      slug: 'ndpa-healthcare',
      category: 'mandatory-compliance',
      duration: 45,
    },
    {
      title: 'Infection Prevention & Control (Nigerian Standards)',
      description: 'Core IPC protocols for public and private hospitals in Nigeria.',
      slug: 'ipc-nigeria',
      category: 'mandatory-compliance',
      duration: 60,
    }
  ];

  for (const course of mandatoryCourses) {
    const category = await prisma.category.findUnique({ where: { slug: course.category } });

    await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        durationMins: course.duration,
        isMandatory: true,
        isPublished: true,
        categoryId: category?.id,
        tenantId,
      }
    });
    console.log(`✅ Loaded Mandatory Module: ${course.title}`);
  }

  console.log('✨ Coded Database Loading Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
