import os
from telegraf import Telegraf
from ton import TonClient, WalletContractV4, internal, Address
from ton.crypto import mnemonic_to_wallet_key
from ton.utils import begin_cell

# Initialize Telegram bot
bot = Telegraf(os.getenv('TELEGRAM_BOT_TOKEN'))

# Initialize TON client
ton_client = TonClient(
    endpoint='https://toncenter.com/api/v2/jsonRPC',  # TON API endpoint
    api_key=os.getenv('TON_API_KEY')  # Optional: Add your TON API key if required
)

# Smart contract address (replace with your jetton contract address)
CONTRACT_ADDRESS = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')

# Wallet connection logic
user_wallet = None

@bot.command('connect')
async def connect_wallet(ctx):
    try:
        # Ask the user for their wallet mnemonic (for demonstration purposes only; in production, use a secure method)
        await ctx.reply('Please enter your wallet mnemonic (24 words, separated by spaces):')

        @bot.on('text')
        async def handle_mnemonic(ctx):
            mnemonic = ctx.message.text.split()
            if len(mnemonic) != 24:
                return await ctx.reply('Invalid mnemonic. Please provide 24 words.')

            # Derive wallet key from mnemonic
            key_pair = mnemonic_to_wallet_key(mnemonic)
            wallet = WalletContractV4.create(workchain=0, public_key=key_pair.public_key)
            global user_wallet
            user_wallet = wallet

            await ctx.reply('Wallet connected successfully!')
            bot.remove_handler('text', handle_mnemonic)  # Remove the handler after processing

    except Exception as e:
        print(f"Error connecting wallet: {e}")
        await ctx.reply('Failed to connect wallet. Please try again.')

@bot.command('burn')
async def burn_tokens(ctx):
    if not user_wallet:
        return await ctx.reply('Please connect your wallet first using /connect.')

    try:
        # Ask the user for the amount of jettons to burn
        await ctx.reply('Please enter the amount of jettons to burn:')

        @bot.on('text')
        async def handle_amount(ctx):
            amount_str = ctx.message.text
            try:
                amount = int(amount_str)
                if amount <= 0:
                    return await ctx.reply('Invalid amount. Please enter a positive integer.')

                # Create the message body for the burn operation
                body_cell = begin_cell() \
                    .store_uint(1, 32)  # Assuming op::burn() is 1 \
                    .store_coins(amount) \
                    .end_cell()

                # Create an internal message to the contract
                message = internal({
                    'to': CONTRACT_ADDRESS,
                    'value': '0.1',  # Small amount of TON for gas
                    'body': body_cell
                })

                # Sign and send the transaction
                signed_message = await user_wallet.sign_message(message)
                await ton_client.send_raw_message(signed_message)

                # Wait for transaction confirmation
                transaction_status = await ton_client.wait_for_transaction(signed_message.hash)
                if transaction_status.status == 'completed':
                    await ctx.reply(f'Successfully burned {amount} jettons!')
                else:
                    await ctx.reply('Token burn failed. Please try again.')

            except ValueError:
                await ctx.reply('Invalid amount. Please enter a positive integer.')
            finally:
                bot.remove_handler('text', handle_amount)  # Remove the handler after processing

    except Exception as e:
        print(f"Error burning tokens: {e}")
        await ctx.reply('An error occurred during the token burn process. Please try again.')

# Start the bot
if __name__ == '__main__':
    print('Bot is running...')
    bot.launch()