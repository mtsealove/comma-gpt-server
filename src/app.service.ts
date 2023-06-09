import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { AxiosError } from 'axios';
import mecab from './libs/mecab';
import { Repository } from 'typeorm';
import { Info } from './info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInfoDto } from './create.info.dto';

@Injectable()
export class AppService {
  private readonly openai: OpenAIApi;

  constructor(
    @InjectRepository(Info)
    private readonly infoRepo: Repository<Info>,
  ) {
    const configuration = new Configuration({
      apiKey: process.env.OPEN_AI_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  private groups: Group[] = [
    {
      category: 'GEEKBLE',
      words: ['긱블', '대표', '이정태', '박찬후'],
      prompt: `당신은 기글이입니다.
긱블은 과학공학의 재미를 사람들에게 알리는 스타트업입니다.
긱블의 대표는 이정태씨입니다.
긱블의 창립자는 박찬후씨니다.
이정태씨의 주량은 소주 1짝입니다.
박찬후씨의 주량은 소주 2짝입니다.`,
    },
    {
      category: 'SCHEDULE',
      words: ['쉼표', '일정', '운영진'],
      prompt: `당신은 기글이입니다.
긱블에서는 직원들의 복지를 위해 워크샵을 하는데 이것을 쉼표라고 부릅니다.
쉼표는 2023년 6월 1일 ~ 6월 2일에 거쳐 진행됩니다.
쉼표는 가평의 모꼬지 펜션이라는 곳에서 진행됩니다.
쉼표를 진행하기 위해서 TF 팀을 뽑아 운영진을 구성했는데, 여름, 잔잔, 모루, 해수, 해시로 구성되어 있습니다.
쉼표의 일정은 오후 1시 출발, 오후 2시 도착후 오후 4시까지 자유시간이며, 18시까지 레크레이션 진행 후 19시에 저녁식사를 합니다.
모꼬지 펜션에 가기 위해서 우리는 이미 45인승 버스를 대절했고, 긱블에서 오후 1시에 출발할 것입니다.`,
    },
    {
      category: 'MENU',
      words: ['저녁', '식사', '메뉴', '술', '먹어', '점심'],
      prompt: `당신은 기글이입니다.
저녁 식사 시간은 오후 7시이고 메뉴는 삼겹살입니다.
술은 무제한으로 준비되어 있습니다.`,
    },
  ];
  private getQuestionFix(question: string): string {
    if (question.endsWith('야') || question.endsWith('어')) {
      return question.indexOf('?') !== -1 ? `${question}?` : question;
    }
    return question;
  }

  async getAnswer(question: string) {
    /*
    const nouns = await this.getNouns(question);
    // 무조건 질문형으로 변경
    const questionFix = this.getQuestionFix(question);
    const prompt = `${this.getPrompt(nouns)}
Q: ${questionFix}
A: `;
     */
    const infos = await this.getInfos();
    const messages: ChatCompletionRequestMessage[] = infos.map((i) => {
      return {
        role: 'assistant',
        content: i.data,
      };
    });
    console.log(messages);
    return new Promise((resolve, reject) => {
      this.openai
        .createChatCompletion({
          model: 'gpt-3.5-turbo',
          temperature: 0,
          messages: [
            ...messages,
            {
              role: 'user',
              content: question,
            },
          ],
        })
        .then((res) => {
          const { choices } = res.data;
          if (choices.length === 0) {
            throw new NotFoundException('질문을 이해할 수가 없습니다');
          }
          resolve(choices[0].message.content);
        })
        .catch((e: AxiosError) => {
          console.error(e.response.data);
          reject();
        });
    });
  }

  // 단어에 따라 질문 고르기
  private getPrompt(nouns: string[]) {
    let selectedGroup: Group = this.groups[0];
    for (let i = 0; i < nouns.length; i++) {
      const noun = nouns[i];
      for (let j = 0; j < this.groups.length; j++) {
        const group = this.groups[j];
        if (group.words.indexOf(noun) !== -1) {
          selectedGroup = group;
          break;
        }
      }
    }
    return selectedGroup.prompt;
  }

  // 단어 추출
  private getNouns(question: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      mecab(question, (str) => {
        const filtered = str.filter((s) => s[1] === 'NNG');
        const mapped: string[] = filtered.map((s) => s[0]);
        resolve(mapped);
      });
    });
  }

  async createInfo(dto: CreateInfoDto): Promise<Info> {
    const { data } = dto;
    const info = Info.create({ data });
    await this.infoRepo.save(info);
    return info;
  }

  async updateInfo(id: number, dto: CreateInfoDto): Promise<Info> {
    const info = await this.getInfo(id);
    const { data } = dto;
    info.data = data;
    await this.infoRepo.save(info);
    return info;
  }

  async deleteInfo(id: number): Promise<Info> {
    const info = await this.getInfo(id);
    await this.infoRepo.remove(info);
    return info;
  }

  async getInfo(id: number): Promise<Info> {
    const info = await this.infoRepo.findOne({ where: { id } });
    if (!info) {
      throw new NotFoundException(`info ${id} not found`);
    }
    return info;
  }

  async getInfos(): Promise<Info[]> {
    return await this.infoRepo.find();
  }
}
