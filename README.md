# Arena App

## Setup:

1. Install NodeJS v22.12.0 LTS. You can use a NodeJS version manager like `nvm` to do this:

    ```
    nvm install v22.12.0
    nvm use v22.12.0
    ```

2. Install `pnpm` by running `npm i -g pnpm`.

3. Create a `.env` file. You can use the `.env.example` as a template.

4. Install dependencies:

    ```
    cd app
    pnpm i
    ```

## Docker Build System:

This project uses [Docker Compose profiles](https://docs.docker.com/compose/how-tos/profiles/). Currently, there is one profile: `dev` and `prod`.

Run `docker compose --profile PROFILE down` to stop and delete all containers in the specified profile.

> [!NOTE]
> Adding the `-v` flag only deletes the `node_modules` cache mount. To clear database data, you'll need to delete the `db/data` folder, which usually needs root permissions.

Run `docker compose --profile PROFILE up --build` to build and run all containers in the specified profile. Adding the `-d` flag runs the containers in the background.

The `dev` profile binds mount your source code into the containers and so supports hot reloading with Vite. **However, changes to the `package.json` and `pnpm-lock.yaml` do require full container rebuilds.**

> [!NOTE]
> It is advised to run `pnpm i` locally and also delete the `node_modules` cache mount by running `docker compose --profile PROFILE down -v` in this case before rebuilding.

Obviously, changes to `.env` also require container restarts.

> [!NOTE]
> If you're on Windows and hot-reloading doesn't seem to be working, add this snippet inside the config object in `app/vite.config.ts`:
> ```
> server: {
>   watch: {
>     usePolling: true,
>   }
> }
> ```
> This is detailed [here](https://vite.dev/config/server-options#server-watch).
