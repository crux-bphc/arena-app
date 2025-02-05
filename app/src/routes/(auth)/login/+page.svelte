<style>
    .background {
        background: url('$lib/assets/images/login/spots.png')
    }
</style>

<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import header from "$lib/assets/images/login/header.svg";
    import google from "$lib/assets/images/login/google.svg";
</script>
<div class="background flex flex-col gap-7 justify-center items-center font-bold h-full absolute w-full select-none">
    <!-- Arena 2025 svg logo because css is hard -->
    <img src={header} alt="Arena 2025 header" class="pointer-events-none" />
    <a href="/api/oauth">
        <Button class="bg-white hover:bg-gray-300 active:bg-grey-300 font-semibold w-64 rounded-xl flex gap-2">
            <img src={google} alt="Arena 2025 header" class="inline pointer-events-none" />
            <span class="text-xs text-accent font-bold">
                SIGN IN WITH GOOGLE
            </span>
        </Button>
    </a>
    <div class="font-bold self-end justify-self-end right-2 absolute bottom-2 text-primary">powered by cruX</div>
</div>