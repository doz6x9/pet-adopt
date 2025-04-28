export type Pet = {
	id: number;
	name: string;
	picture: string;
	type: string;            // e.g. 'puppy' | 'kitten'
	adopted: boolean;
	hunger: number;          // 0–100
	happiness: number;       // 0–100
	ownerId: number | null;  // user.id or null
  };
  
  export type SafeUser = {
	id: number;
	name: string;
	budget: number;
	inventory: {
	  food: number;
	  toy: number;
	  treat: number;
	};
  };
  