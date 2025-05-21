import { MainLayout } from "@/components/main-layout"
import { WelcomeScreen } from "@/components/welcome-screen"

export default function Home() {
  // In a real app, we would check if the user has any boards
  // If they do, we would redirect to the first board
  // For now, we'll just show the welcome screen
  const hasBoards = false

  return <MainLayout>{hasBoards ? <div>Board content would go here</div> : <WelcomeScreen />}</MainLayout>
}
