import * as layout from "..\\..\\..\\src\\routes\\$layout.svelte";

const components = [
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\leaderboards.svelte"),
	() => import("..\\..\\..\\src\\routes\\my_classes.svelte"),
	() => import("..\\..\\..\\src\\routes\\account.svelte"),
	() => import("..\\..\\..\\src\\routes\\signup\\admin.svelte"),
	() => import("..\\..\\..\\src\\routes\\about.svelte"),
	() => import("..\\..\\..\\src\\routes\\login\\student.svelte"),
	() => import("..\\..\\..\\src\\routes\\login\\admin.svelte"),
	() => import("..\\..\\..\\src\\routes\\game.svelte")
];

const d = decodeURIComponent;
const empty = () => ({});

export const routes = [
	// src/routes/index.svelte
[/^\/$/, [components[0]]],

// src/routes/leaderboards.svelte
[/^\/leaderboards\/?$/, [components[1]]],

// src/routes/my_classes.svelte
[/^\/my_classes\/?$/, [components[2]]],

// src/routes/account.svelte
[/^\/account\/?$/, [components[3]]],

// src/routes/signup/admin.svelte
[/^\/signup\/admin\/?$/, [components[4]]],

// src/routes/about.svelte
[/^\/about\/?$/, [components[5]]],

// src/routes/login/student.svelte
[/^\/login\/student\/?$/, [components[6]]],

// src/routes/login/admin.svelte
[/^\/login\/admin\/?$/, [components[7]]],

// src/routes/game.svelte
[/^\/game\/?$/, [components[8]]],

// src/routes/api/getBooks.ts
[/^\/api\/getBooks\/?$/]
];

export { layout };