import { LoginForm } from "/src/@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 w-full">
            <div className="flex items-center justify-center rounded-md text-primary-foreground">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/black-logo.png" alt="Logo" />
            </div> 
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://get.pxhere.com/photo/image-tree-natural-landscape-nature-leaf-autumn-yellow-deciduous-natural-environment-woody-plant-woodland-forest-plant-road-grove-sunlight-grass-nature-reserve-lane-path-biome-road-surface-branch-temperate-broadleaf-and-mixed-forest-spring-sky-thoroughfare-infrastructure-trail-landscape-park-street-trunk-plane-state-park-Northern-hardwood-forest-nonbuilding-structure-1630441.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
