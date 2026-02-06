import "dotenv/config";
import prisma from "../lib/prisma";
import { ProjectPhase, ProjectWorkPhase, ArtifactType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// Helper to calculate date relative to today
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function main() {
  console.log("🌱 Starting detailed database seed...");

  // 2. Create Admin Users
  const hashedPassword = await bcrypt.hash("spirit45", 10);

  const admin1 = await prisma.user.upsert({
    where: { username: "pamtechno" },
    update: {},
    create: {
      username: "pamtechno",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin user 1 ready:", admin1.username);

  const admin2 = await prisma.user.upsert({
    where: { username: "pamtrack" },
    update: {},
    create: {
      username: "pamtrack",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin user 2 ready:", admin2.username);

  // ------------------------------------------------------------------
  // Helper for Idempotent Project Creation
  // ------------------------------------------------------------------
  const upsertProject = async (name: string, data: any) => {
    const existing = await prisma.project.findFirst({
      where: { projectName: name },
    });
    if (existing) {
      console.log(`⏩ Skipping: ${name} (already exists)`);
      return existing;
    }
    const created = await prisma.project.create({ data });
    console.log(`✅ Created: ${name}`);
    return created;
  };

  // ------------------------------------------------------------------
  // Scenario 1: Fresh Project (Discovery Phase)
  // ------------------------------------------------------------------
  const freshProject = await upsertProject("Corporate Dashboard System", {
    clientName: "PT Sinergi Digital",
    clientPhone: "62895600077007",
    projectName: "Corporate Dashboard System",
    deadline: daysFromNow(60),
    status: "On Progress",
    currentPhase: ProjectWorkPhase.DEVELOPMENT,
    developmentProgress: 15,
    maintenanceProgress: 0,
    logs: {
      create: [
        {
          title: "Project Kickoff & Requirement Gathering",
          description:
            "Meeting awal dengan stakeholder untuk mendefinisikan scope dan KPI project.",
          percentage: 5,
          phase: ProjectWorkPhase.DEVELOPMENT,
          createdAt: daysFromNow(-5),
        },
        {
          title: "System Architecture Design",
          description: "Finalisasi tech stack dan struktur database schema.",
          percentage: 15,
          phase: ProjectWorkPhase.DEVELOPMENT,
          createdAt: daysFromNow(-1),
        },
      ],
    },
    artifacts: {
      create: [
        {
          title: "Kickoff Meeting MOM",
          description: "Notes regarding timeline and deliverables.",
          phase: ProjectPhase.DISCOVERY,
          type: ArtifactType.MEETING_NOTES,
          sourceLinkUrl: "https://docs.google.com/document/d/example-mom",
        },
        {
          title: "Initial Tech Stack Proposal",
          description: "Comparison between Next.js and Vue for this dashboard.",
          phase: ProjectPhase.DISCOVERY,
          type: ArtifactType.OTHER,
          sourceLinkUrl: "https://docs.google.com/presentation/d/example-tech",
        },
      ],
    },
  });

  // ------------------------------------------------------------------
  // Scenario 2: Active Development (Design/Dev Phase)
  // ------------------------------------------------------------------
  const devProject = await upsertProject("POS System & Landing Page", {
    clientName: "Coffeeshop 'Kopi Senja'",
    clientPhone: "62895600077007",
    projectName: "POS System & Landing Page",
    deadline: daysFromNow(30),
    status: "On Progress",
    currentPhase: ProjectWorkPhase.DEVELOPMENT,
    developmentProgress: 65,
    maintenanceProgress: 0,
    logs: {
      create: [
        {
          title: "Frontend Integration",
          description: "Menghubungkan UI Landing Page dengan API CMS.",
          percentage: 50,
          phase: ProjectWorkPhase.DEVELOPMENT,
          createdAt: daysFromNow(-10),
        },
        {
          title: "POS Core Features",
          description:
            "Fitur pencatatan transaksi dan cetak struk selesai dikerjakan.",
          percentage: 65,
          phase: ProjectWorkPhase.DEVELOPMENT,
          createdAt: daysFromNow(-2),
        },
      ],
    },
    artifacts: {
      create: [
        {
          title: "High Fidelity UI Design",
          description: "Final design for mobile and desktop views.",
          phase: ProjectPhase.DESIGN,
          type: ArtifactType.WIREFRAME,
          sourceLinkUrl: "https://figma.com/file/example-pos-design",
        },
      ],
    },
    feedbacks: {
      create: [
        { message: "Tombol checkout di mobile tolong diperbesar sedikit." },
        { message: "Warna struk diganti hitam saja biar hemat tinta." },
      ],
    },
    updates: {
      create: [
        {
          phase: ProjectPhase.DEVELOPMENT,
          description:
            "Integrasi Payment Gateway Midtrans berhasil dilakukan di environment Sandbox.",
          links: {
            create: [
              { label: "Demo Video", url: "https://youtube.com/example-demo" },
            ],
          },
        },
      ],
    },
  });

  // ------------------------------------------------------------------
  // Scenario 3: Maintenance Mode (Project Completed & Live)
  // ------------------------------------------------------------------
  const maintenanceProject = await upsertProject("Travel Booking Platform V1", {
    clientName: "Buana Travel Agent",
    clientPhone: "62895600077007",
    projectName: "Travel Booking Platform V1",
    deadline: daysFromNow(-30),
    status: "Done",
    currentPhase: ProjectWorkPhase.MAINTENANCE,
    developmentProgress: 100,
    maintenanceProgress: 100,
    developmentCompletedAt: daysFromNow(-35),
    logs: {
      create: [
        {
          title: "Grand Launching 🚀",
          description: "Sistem live di production server. Domain aktif.",
          percentage: 100,
          phase: ProjectWorkPhase.DEVELOPMENT,
          createdAt: daysFromNow(-35),
        },
        {
          title: "Weekly Health Check",
          description:
            "Pengecekan server load dan backup database. Semua sistem normal.",
          percentage: 100,
          phase: ProjectWorkPhase.MAINTENANCE,
          createdAt: daysFromNow(-7),
        },
        {
          title: "Security Patch Update",
          description:
            "Update library dependencies untuk menutup celah keamanan minor.",
          percentage: 100,
          phase: ProjectWorkPhase.MAINTENANCE,
          createdAt: daysFromNow(-1),
        },
      ],
    },
    artifacts: {
      create: [
        {
          title: "User Manual Guide",
          description: "Panduan penggunaan CMS untuk admin travel.",
          phase: ProjectPhase.LAUNCH,
          type: ArtifactType.OTHER,
          sourceLinkUrl: "https://docs.google.com/pdf/manual-v1.pdf",
        },
      ],
    },
    updates: {
      create: [
        {
          phase: ProjectPhase.MAINTENANCE,
          description:
            "Performance Optimization: Reduced API latency by 40% after caching implementation.",
          createdAt: daysFromNow(-14),
        },
      ],
    },
  });

  // ------------------------------------------------------------------
  // Scenario 4: Completed but still in warranty
  // ------------------------------------------------------------------
  const justFinishedProject = await upsertProject("Klinik Appointment App", {
    clientName: "Dr. Gigi Santoso",
    clientPhone: "62895600077007",
    projectName: "Klinik Appointment App",
    deadline: daysFromNow(-2),
    status: "Done",
    currentPhase: ProjectWorkPhase.DEVELOPMENT,
    developmentProgress: 100,
    maintenanceProgress: 0,
    developmentCompletedAt: daysFromNow(-1),
    logs: {
      create: [
        {
          title: "Final Deployment",
          description:
            "Deploy ke VPS dan konfigurasi domain klinik-santoso.com.",
          percentage: 100,
          phase: ProjectWorkPhase.DEVELOPMENT,
          createdAt: daysFromNow(-1),
        },
      ],
    },
  });

  console.log(
    "\n🎉 Seed completed! Use the tokens below to test the tracking page:",
  );
  console.log(`   - Dev (Early): ${freshProject.uniqueToken}`);
  console.log(`   - Dev (Mid): ${devProject.uniqueToken}`);
  console.log(`   - Maintenance: ${maintenanceProject.uniqueToken}`);
  console.log(`   - Just Finished: ${justFinishedProject.uniqueToken}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
