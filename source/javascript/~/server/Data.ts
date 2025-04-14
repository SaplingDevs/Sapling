export const PistonDirections = [ 'Down', 'Up', 'South', 'North', 'East', 'West' ];
export const PistonAssets = {
	'Up:Expanding': [ 0, 1, 0 ],
	'Up:Retracting': [ 0, -1, 0 ],
	'Down:Expanding': [ 0, -1, 0 ],
	'Down:Retracting': [ 0, 1, 0 ],
	'North:Expanding': [ 0, 0, -1 ],
	'North:Retracting': [ 0, 0, 1 ],
	'South:Expanding': [ 0, 0, 1 ],
	'South:Retracting': [ 0, 0, -1 ],
	'East:Expanding': [ 1, 0, 0 ],
	'East:Retracting': [ -1, 0, 0 ],
	'West:Expanding': [ -1, 0, 0 ],
	'West:Retracting': [ 1, 0, 0 ]
}