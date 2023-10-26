import { Command, CommandFrame } from 'src/models/Command';
import { api } from 'src/boot/ofetch';

class CommandService {
  async createCommand(command: CommandFrame): Promise<Command> {
    return await api<Command>('jobs/command/createCommand', {
      method: 'POST',
      body: command,
    });
  }

  async getCommand(id: string): Promise<Command> {
    return await api<Command>(`jobs/command/getCommandById/${id}`);
  }

  //TODO getCommandByName

  async getCommands(sortBy: string, sortDirection: string): Promise<Command[]> {
    return await api<Command[]>(
      `jobs/command/getAllCommands/${sortBy}/${sortDirection}`
    );
  }

  // TODO getCommandsByDeviceType

  async deleteCommand(id: string): Promise<void> {
    await api(`jobs/command/deleteCommand/${id}`, {
      method: 'DELETE',
    });
  }

  // TODO updateCommand
}

export default new CommandService();
