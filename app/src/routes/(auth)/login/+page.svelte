<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
</script>
<div class="flex flex-col gap-7 justify-center items-center font-bold h-full absolute">
    <div class="grid grid-rows-2 w-full h-fit text-primary" style="grid-template-columns: 4fr 1fr; transform: scaleY(1.2) scaleX(0.8);">
        <div class="text-8xl text-center font-extrabold self-end" style="grid-row: span 2; transform: scaleY(1.22) translateY(-3.5px)">ARENA</div>
        <div class="text-5xl text-center self-end font-extrabold">20</div>
        <div class="text-5xl text-center self-end font-extrabold">25</div>
    </div>
    <a href="/api/oauth">
        <Button class="bg-white hover:bg-gray-300 active:bg-grey-300 font-semibold w-64 rounded-xl">
            <span class="text-sm text-accent">(G) SIGN IN WITH GOOGLE</span>
        </Button>
    </a>
</div>