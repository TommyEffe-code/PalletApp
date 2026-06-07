# PalletApp Agents & Architectural Decisions

This document outlines the design patterns, architectural choices, and technical mandates for the PalletApp system. All agents working on this codebase must adhere to these standards.

## 🏗 System Overview
PalletApp is a fast, scanner-optimized web application for managing supermarket surplus stock. It uses a **Next.js Full-stack** approach with **SQLite** for simplicity and **Open Food Facts API** for real-time product enrichment.

## 🛠 Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS (Optimized for shared-device/cold-room visibility)
- **Scanner Integration:** Global Keyboard Event Hook (Keyboard-wedge emulation)
- **API Integration:** Open Food Facts (JSON API)

## 🔐 Authentication Mandate
- **Model:** Department-based shared passwords.
- **Implementation:** Secure HTTP-only cookies (`department_id`).
- **No Individual Accounts:** The system is designed for shared kiosk usage.

## 📋 Database Schema Standards
- **Pallet:** Must always include `createdAt` for FIFO (First-In-First-Out) sorting.
- **ProductEntry:** Tracks `isCase` (Boolean) to distinguish between individual items and whole cases (colli) without requiring conversion math.
- **Grouping:** Items with the same barcode but different `isCase` status are stored as distinct records but grouped in the UI for clarity.

## ⌨️ Scanner Workflow Mandate (Critical)
- **No Focus Required:** The `useScanner` hook MUST listen to global keyboard events. Never force an operator to click an input field to start scanning.
- **Debounce:** Current manual typing simulation debounce is **2000ms**. In production, this should be reduced to **100ms** for hardware scanners.
- **Feedback:** Every scan must trigger immediate visual (flash/UI update) and optionally auditory feedback.

## 📦 UI/UX Patterns
- **High Contrast:** Use large buttons and high-contrast colors (Blue for Singles, Orange for Cases) for readability in supermarket environments.
- **FIFO Enforcement:** The dashboard MUST highlight the oldest pallets (oldest first) to ensure inventory rotation.
- **Real-time Enrichment:** Always attempt to fetch data from Open Food Facts in the background. If unavailable, fall back gracefully to the raw barcode.

## 🚀 Deployment Considerations
- **Persistence:** Since SQLite is used, the deployment environment MUST support a persistent volume (e.g., Docker volumes, Railway/Render persistent disks).
- **Offline Support (Future):** While currently cloud-hosted, the architecture should remain modular enough to be moved to a local Raspberry Pi/Intranet server if internet reliability becomes an issue.
